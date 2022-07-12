import React from "react";
import PenBlack from "@/assets/img/canvas/crayons/black-pen.svg";
import PenBlue from "@/assets/img/canvas/crayons/blue-pen.svg";
import PenBrown from "@/assets/img/canvas/crayons/brown-pen.svg";
import PenGreen from "@/assets/img/canvas/crayons/green-pen.svg";
import PenGray from "@/assets/img/canvas/crayons/grey-pen.svg";
import PenOrange from "@/assets/img/canvas/crayons/orange-pen.svg";
import PenPink from "@/assets/img/canvas/crayons/pink-pen.svg";
import PenPurple from "@/assets/img/canvas/crayons/purple-pen.svg";
import PenRed from "@/assets/img/canvas/crayons/red-pen.svg";
import PenWhite from "@/assets/img/canvas/crayons/white-pen.svg";
import PenYellow from "@/assets/img/canvas/crayons/yellow-pen.svg";

export enum CanvasColor {
    BLACK = `#000000`,
    GRAY = `#8E8E8E`,
    WHITE = `#ffffff`,
    BLUE = `#204FCF`,
    PURPLE = `#9C50FF`,
    PINK = `#FA58CD`,
    RED = `#E63E3E`,
    BROWN = `#9F5710`,
    ORANGE = `#FF7900`,
    YELLOW = `#FFD112`,
    GREEN = `#09AD00`,
}


export const CanvasColors = [
    {
        name: CanvasColor.BLACK,
        value: `#000000`,
        img: PenBlack,
    },
    {
        name: CanvasColor.GRAY,
        value: `#8E8E8E`,
        img: PenGray,
    },
    {
        name: CanvasColor.WHITE,
        value: `#ffffff`,
        img: PenWhite,
    },
    {
        name: CanvasColor.BLUE,
        value: `#204FCF`,
        img: PenBlue,
    },
    {
        name: CanvasColor.PURPLE,
        value: `#9C50FF`,
        img: PenPurple,
    },
    {
        name: CanvasColor.PINK,
        value: `#FA58CD`,
        img: PenPink,
    },
    {
        name: CanvasColor.RED,
        value: `#E63E3E`,
        img: PenRed,
    },
    {
        name: CanvasColor.BROWN,
        value: `#9F5710`,
        img: PenBrown,
    },
    {
        name: CanvasColor.ORANGE,
        value: `#FF7900`,
        img: PenOrange,
    },
    {
        name: CanvasColor.YELLOW,
        value: `#FFD112`,
        img: PenYellow,
    },
    {
        name: CanvasColor.GREEN,
        value: `#09AD00`,
        img: PenGreen,
    },
];

