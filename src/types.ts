import {RequestHandler} from 'express-serve-static-core';
import { UserProfile } from '@loopback/security'

export type FileUploadHandler = RequestHandler;

export interface CustomUserProfile extends UserProfile {
    // `email` and `name` are added to be identical with the
    // `UserProfile` that previously was exported by `@loopback/authentication`
    email?: string;
    name?: string;
    roles?: string[];
  }