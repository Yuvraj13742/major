import java.io.IOException;
import java.io.RandomAccessFile;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Cryption {
    public static int executeCryption(String taskData) {
        Task task;
        try {
            task = Task.fromString(taskData);
        } catch (IllegalArgumentException e) {
            System.err.println("Failed to parse task: " + e.getMessage());
            return 1;
        }

        int key = task.getKey();

        try (RandomAccessFile file = new RandomAccessFile(task.getFilePath(), "rw")) {
            long length = file.length();
            if(task.getAction() == Action.ENCRYPT) {
                for (long i = 0; i < length; i++) {
                    file.seek(i);
                    int b = file.read();
                    if (b != -1) {
                        int encrypted = (b + key) % 256;
                        file.seek(i);
                        file.write(encrypted);
                    }
                }
            } else {
                for (long i = 0; i < length; i++) {
                    file.seek(i);
                    int b = file.read();
                    if (b != -1) {
                        int decrypted = (b - key + 256) % 256;
                        file.seek(i);
                        file.write(decrypted);
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Error processing file " + task.getFilePath() + ": " + e.getMessage());
            return 1;
        }

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println("Exiting the encryption/decryption process at " + formatter.format(new Date()));
        return 0;
    }
}
