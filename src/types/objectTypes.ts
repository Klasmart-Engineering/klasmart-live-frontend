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
