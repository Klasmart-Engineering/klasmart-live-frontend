// TODO: Get rid of this
export function getContentId(lessonMaterialId: string) {
    const arr = [
        { id: "2b3a1327-bd25-486e-8759-d76707369f2f", contentId: "5ecf71d2611e18398f7380f2" },
        { id: "4593d05c-5f45-492a-8ad8-b9e74d371f57", contentId: "5ed75e1b6aad833ac89a47fa" },
        { id: "4dead823-f9c8-45b0-9c92-6c7a2bc40106", contentId: "5ed0b64a611e18398f7380fb" },
        { id: "4e5db3e2-3050-4c00-8c32-7c6e7baf48e1", contentId: "5ed99fe36aad833ac89a4803" },
        { id: "7ceeff21-c6c3-4c03-a988-824297ca6326", contentId: "5ed07656611e18398f7380f6" },
        { id: "cd07c56d-8ac0-45c7-b406-3ae1144cddfb", contentId: "5ecf4e4b611e18398f7380ef" },
    ];
    return arr.filter(item => item.id === lessonMaterialId)[0].contentId;
}