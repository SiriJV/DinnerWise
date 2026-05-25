export interface UserProfile {
  id: number;
  name: string;
  alias: string;
  bio: string | null;
  profile_picture_url: string | null;
  banner_picture_url: string | null;
}