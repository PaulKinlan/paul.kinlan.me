import { rewrite, geolocation } from '@vercel/edge';

// config with custom matcher
export const config = {
  matcher: '/',
};

// module.exports = async (request,) => {
//   const { path } = request.query;
//   const host = request.headers['x-forwarded-host'];
//   const proto = request.headers['x-forwarded-proto'];

//   // Vercel doesn't support streaming so right now just read into the buffer.
//   try {
//     const file = await readFile(join(root, path), 'utf8');
//     let regexp = /<!--#include(.+)-->/g;
//     let index = 0;
//     while ((match = regexp.exec(file)) !== null) {
//       const matchIndex = match.index;
//       response.write(file.slice(index, matchIndex));
//       index = matchIndex;

//       const params = match[1].match(/(file|virtual)="(.+?)"/);
//       if (params && params.length > 0) {
//         const type = params[1];
//         const value = params[2];
//         if (type === 'file') {
//           response.write(await readFile(join(root, value), 'utf8'));
//         } else if (type === 'virtual') {
//           // fetch.
//           const fetchResponse = await fetch(new URL(value, `${proto}://${host}`));
//           response.write(await fetchResponse.text(), 'utf8');
//         } else {
//           // Some error of sorts.
//           console.log('#include is not valid');
//         }
//       }
//     }
//     // Write to the end.
//     response.write(file.slice(index));
//   } catch (ex) {
//     response.write('404');
//     response.write(ex.toString());
//   }
//   response.end();
// };

export class ReplaceSSIStream extends TransformStream {
  constructor() {
    super({
      transform(chunk, controller) {
        console.log('transform', chunk)
        controller.enqueue(chunk);
      }
    })
  }
}

export function middleware(request: Request) {
  console.log('middleware', request.url)
  return new Response(request.body.pipeThrough(new ReplaceSSIStream()), {
    status: 200, headers: {
      'content-type': 'text/html'
    }
  });
}