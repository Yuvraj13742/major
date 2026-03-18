import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ReadEnv {
    public String getEnv() {
        try {
            Path envPath = Paths.get(".env");
            if (Files.exists(envPath)) {
                return new String(Files.readAllBytes(envPath)).trim();
            } else {
                System.err.println("Unable to open file .env");
                return "0"; // Default to 0 if not found
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "0";
        }
    }
}
