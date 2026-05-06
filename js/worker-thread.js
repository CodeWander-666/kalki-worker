// Web Worker – can be used later to offload WebGPU computations
self.onmessage = async function(e) {
  const { task } = e.data;
  let hash = 0;
  const iter = task.cost || 50000000;
  for (let i = 0; i < iter; i++) hash = (hash + Math.random()) % 1e9;
  postMessage({
    taskId: task.id,
    hash: Math.floor(hash).toString(16),
    elapsed: performance.now()
  });
};
