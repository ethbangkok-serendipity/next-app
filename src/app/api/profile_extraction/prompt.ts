import { PromptTemplate } from "@langchain/core/prompts"

const promptTemplate = new PromptTemplate({
  inputVariables: ["twitter_profile"],
  template: `
    Analyze the following input data:
    - **Twitter profile description**
    - **Profile data of mentioned Twitter handles**
    - **Content of URLs provided by the user**
    - **Survey responses about interests**

Extract information under **Demographic**, **Interest**, and **Behavior** categories. For each value:
1. Provide a **confidence score** (0.1 to 1).
2. Include the **argument** supporting the value.

Only include non-empty fields with sufficient evidence. Format the output as a structured JSON object.

Input: {twitter_profile}
Output:
  `,
})

export default promptTemplate;
