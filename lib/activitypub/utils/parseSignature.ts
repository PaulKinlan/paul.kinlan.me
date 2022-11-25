import { VercelRequest } from '@vercel/node';
import parser from '../../http-signature/index';

export function parseSignature(request: VercelRequest) {
  const { url, method, headers } = request;
  return parser.parse({ url, method, headers });
}
