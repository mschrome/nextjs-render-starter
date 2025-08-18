export const onRequestGet = async (context) => {
  return new Response('Hello, World!', {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
  });
};


