export interface UserAgent {
  isMobile: boolean;
  isIOS: boolean;
  isIE: boolean;
  isEdge: boolean;
  isLandscape?: boolean;
}

export interface MenuItem {
  description: string;
  link: string;
  logo: JSX.Element;
  title: string;
}

export interface ContentItem {
  description: string;
  link: string;
  image: string;
  title: string;
  type?: "lesson-plan" | "lesson-material" | undefined;
}

export type LibraryContentType = "OwnedContent" | "Marketplace";

export interface IUserContext {
  roomId: string;
  teacher: boolean;
  name: string;
}
