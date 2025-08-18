export async function onRequest({ request, params, env }) {
  // my_kv 是您在项目中绑定命名空间时的变量名
  const visitCount = await my_kv.get('visitCount');
  let visitCountInt = Number(visitCount);
  visitCountInt += 1;
  await my_kv.put('visitCount', visitCountInt.toString());

  const res = JSON.stringify({
    visitCount: visitCountInt,
    description: '访问累加值',
  });

  return new Response(res, {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
