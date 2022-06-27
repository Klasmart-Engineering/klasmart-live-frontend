import useScrollCanvasWithContent from "./useScrollCanvasWithContent";
import {
    act,
    renderHook,
} from '@testing-library/react-hooks';
import { RefObject } from "react";

let reference: RefObject<HTMLIFrameElement>;
let mockedPan: jest.Mock;
describe(`useScrollCanvasWithContent`, () => {
    describe(`initial value`, () => {
        beforeAll(() => {
            reference = {
                current: null,
            };
            Object.defineProperty(reference, `current`, {
                get: jest.fn(() => null),
                set: jest.fn(() => null),
            });
            mockedPan = jest.fn(() => { });
        });
        test(`default props`, () => {
            const { result } = renderHook(() =>
                useScrollCanvasWithContent(reference, false, true, mockedPan));
            expect(result.current.lastScrollVal)
                .toBe(0.0);
        });
        test(`scroll callback`, () => {
            const { result } = renderHook(() =>
                useScrollCanvasWithContent(reference, false, true, mockedPan));
            const doc = document.createElement(`div`);
            doc.scrollTop = 120;
            document.body.appendChild(doc);
            result.current.scrollCanvas(doc, 0);
            expect(mockedPan)
                .toHaveBeenCalledWith({
                    x: 0,
                    y: -100,
                });
        });
    });
});
