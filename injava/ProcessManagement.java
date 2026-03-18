import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class ProcessManagement {
    private final BlockingQueue<String> queue;
    private final ExecutorService executorService;
    private final AtomicInteger size;

    public ProcessManagement() {
        // Imitate C++ emptySlotsSemaphore created with 1000 slots
        this.queue = new ArrayBlockingQueue<>(1000);
        // Using a fixed thread pool to represent the detached threads
        this.executorService = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
        this.size = new AtomicInteger(0);
    }

    public boolean submitToQueue(Task task) {
        if (size.get() >= 1000) {
            System.out.println("Queue is full");
            return false;
        }
        
        try {
            queue.put(task.toString()); // Blocks if the queue is full, similar to sem_wait
            size.incrementAndGet();
            
            // Spawn a task in the thread pool to execute tasks, imitating thread_1.detach()
            executorService.submit(this::executeTasks);
            
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Thread was interrupted while submitting to queue");
            return false;
        }
    }

    private void executeTasks() {
        try {
            String taskStr = queue.take(); // Blocks until a task is available, similar to sem_wait(itemsSemaphore)
            size.decrementAndGet();
            Cryption.executeCryption(taskStr);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
