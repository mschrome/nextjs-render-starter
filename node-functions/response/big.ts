const EIGHT_MB = 8 * 1024 * 1024; // 8 MiB

function generateChunk(size: number): Uint8Array {
  const chunk = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    chunk[i] = 65 + (i % 26); // ASCII A-Z pattern
  }
  return chunk;
}

export const onRequestGet = async ({ request }: { request: Request }): Promise<Response> => {
  // Allow query ?bytes= to control size; default > 8MB to exceed limit
  let targetBytes = EIGHT_MB + 1024 * 1024; // 9MB default
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("bytes");
    if (q) {
      const n = Number(q);
      if (!Number.isNaN(n) && n > 0) {
        targetBytes = n;
      }
    }
  } catch {
    // ignore URL parse error in some local proxies
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const chunkSize = 256 * 1024; // 256KB per chunk
      let sent = 0;
      const chunk = generateChunk(chunkSize);

      function push() {
        if (sent >= targetBytes) {
          controller.close();
          return;
        }
        const remaining = targetBytes - sent;
        const size = Math.min(chunkSize, remaining);
        controller.enqueue(size === chunkSize ? chunk : chunk.slice(0, size));
        sent += size;
        // Yield to event loop to avoid blocking
        setTimeout(push, 0);
      }

      push();
    },
    type: "bytes",
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="big-${targetBytes}.bin"`,
      "Cache-Control": "no-store",
    },
  });
};


