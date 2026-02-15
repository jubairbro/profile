export interface UserData {
  username: string;
  name: string;
  age: number;
  profession: string;
  location: {
    city: string;
    country: string;
  };
  interests: string[];
  contact: {
    telegram: string;
  };
}

export interface NavLink {
  href: string;
  label: string;
}

export interface ProjectLink {
  icon: string;
  title: string;
  description: string;
  url: string;
  delay: string;
}