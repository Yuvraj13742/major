import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;
import java.util.stream.Stream;

public class Main {
    public static void main(String[] args) {
        String directory;
        String actionInput;
        
        if (args.length >= 2) {
            directory = args[0];
            actionInput = args[1];
        } else {
            Scanner scanner = new Scanner(System.in);
            System.out.println("Enter the directory path:");
            directory = scanner.nextLine();
            
            System.out.println("Enter the action(Encrypt/Decrypt):");
            actionInput = scanner.nextLine();
            scanner.close();
        }
        
        Path dirPath = Paths.get(directory);
        
        if (Files.exists(dirPath) && Files.isDirectory(dirPath)) {
            ProcessManagement processManagement = new ProcessManagement();
            Action action = actionInput.equalsIgnoreCase("ENCRYPT") ? Action.ENCRYPT : Action.DECRYPT;
            
            try (Stream<Path> paths = Files.walk(dirPath)) {
                paths.filter(Files::isRegularFile).forEach(path -> {
                    String filePath = path.toAbsolutePath().toString();
                    
                    // Direct enqueue; file handled asynchronously by ProcessManagement
                    Task task = new Task(filePath, action);
                    
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    System.out.println("Entering the encryption/decryption process at " + formatter.format(new Date()));
                    
                    processManagement.submitToQueue(task);
                });
                
                // Keep the JVM alive briefly to allow thread pool to finish tasks.
                processManagement.shutdown();
                
            } catch (IOException e) {
                System.out.println("File System Error: " + e.getMessage());
            }
        } else {
            System.out.println("Invalid Directory Path");
        }
    }
}
