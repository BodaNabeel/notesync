import { Session, User } from "better-auth";

export interface UserDetails {
    session: Session;
    user: User;
}