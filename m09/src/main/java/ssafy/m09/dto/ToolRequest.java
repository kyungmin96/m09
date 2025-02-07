package ssafy.m09.dto;

import lombok.Getter;
import lombok.Setter;
import ssafy.m09.domain.en.ToolCategory;

@Getter
@Setter
public class ToolRequest {
    private String toolName;
    private ToolCategory category;
    private int quantity;
}
