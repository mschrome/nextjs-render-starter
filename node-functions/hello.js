// 最基础的 Node 函数：返回纯文本 "Hello, World!"
export const onRequestGet = async (context) => {
  return new Response('Hello, World!', {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
  });
};

export const onRequestPost = async (context) => {
  return new Response('Hello, World!', {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
  });
};


