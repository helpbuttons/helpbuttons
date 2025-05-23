import { ExcerptMaxChars } from "./activity.dto.js";

export const excerpt = (message) => message.substring(0,ExcerptMaxChars) + message.length > ExcerptMaxChars ? '...' : ''
