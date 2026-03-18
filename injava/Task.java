public class Task {
    private String filePath;
    private Action action;

    public Task(String filePath, Action action) {
        this.filePath = filePath;
        this.action = action;
    }

    public String getFilePath() {
        return filePath;
    }

    public Action getAction() {
        return action;
    }

    @Override
    public String toString() {
        return filePath + "," + (action == Action.ENCRYPT ? "ENCRYPT" : "DECRYPT");
    }

    public static Task fromString(String taskData) {
        String[] parts = taskData.split(",", 2);
        if (parts.length == 2) {
            Action action = "ENCRYPT".equals(parts[1]) ? Action.ENCRYPT : Action.DECRYPT;
            return new Task(parts[0], action);
        } else {
            throw new IllegalArgumentException("Invalid Task data format");
        }
    }
}
