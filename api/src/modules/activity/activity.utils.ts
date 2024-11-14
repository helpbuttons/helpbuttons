import { ExcerptMaxChars } from "./activity.dto";

export const excerpt = (message) => message.substring(0,ExcerptMaxChars) + message.length > ExcerptMaxChars ? '...' : ''
