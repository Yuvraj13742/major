public class Task {
    private String filePath;
    private Action action;
    private int key;

    public Task(String filePath, Action action, int key) {
        this.filePath = filePath;
        this.action = action;
        this.key = key;
    }

    public String getFilePath() {
        return filePath;
    }

    public Action getAction() {
        return action;
    }

    public int getKey() {
        return key;
    }

    @Override
    public String toString() {
        return filePath + "," + (action == Action.ENCRYPT ? "ENCRYPT" : "DECRYPT") + "," + key;
    }

    public static Task fromString(String taskData) {
        String[] parts = taskData.split(",", 3);
        if (parts.length >= 2) {
            Action action = "ENCRYPT".equals(parts[1]) ? Action.ENCRYPT : Action.DECRYPT;
            int key = parts.length == 3 ? Integer.parseInt(parts[2]) : 0;
            return new Task(parts[0], action, key);
        } else {
            throw new IllegalArgumentException("Invalid Task data format");
        }
    }
}
