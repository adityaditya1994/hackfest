import axios from 'axios';
import { DatabaseService, TableMetadata } from './DatabaseService';

export class ChatbotService {
  private ollamaUrl = 'http://localhost:11434';
  private model = 'codellama:7b';
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  public async processQuery(userQuery: string): Promise<string> {
    try {
      console.log('Processing query:', userQuery);

      // Step 1: Analyze the query and generate SQL
      const sqlQuery = await this.generateSQL(userQuery);
      
      if (!sqlQuery) {
        return "I couldn't understand your query. Please try asking about employees, teams, gender ratios, qualifications, or performance metrics.";
      }

      console.log('Generated SQL:', sqlQuery);

      // Step 2: Execute the SQL query
      const results = await this.databaseService.executeQuery(sqlQuery);
      
      // Step 3: Generate natural language response
      const response = await this.generateResponse(userQuery, sqlQuery, results);
      
      return response;
    } catch (error) {
      console.error('Error processing query:', error);
      return "I encountered an error while processing your request. Please try again or rephrase your question.";
    }
  }

  private async generateSQL(userQuery: string): Promise<string | null> {
    try {
      const metadata = this.databaseService.getMetadata();
      const prompt = this.buildSQLPrompt(userQuery, metadata);

      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.9,
          top_k: 40
        }
      });

      const generatedText = response.data.response;
      
      // Extract SQL from the response
      const sqlMatch = generatedText.match(/SELECT[\s\S]*?;/gi);
      if (sqlMatch && sqlMatch.length > 0) {
        return sqlMatch[0].trim();
      }

      // If no SQL found, try to extract without semicolon
      const sqlMatch2 = generatedText.match(/SELECT[\s\S]*?(?=\n\n|\n$|$)/gi);
      if (sqlMatch2 && sqlMatch2.length > 0) {
        return sqlMatch2[0].trim() + ';';
      }

      return null;
    } catch (error) {
      console.error('Error generating SQL:', error);
      return null;
    }
  }

  private buildSQLPrompt(userQuery: string, metadata: TableMetadata[]): string {
    const schemaInfo = metadata.map(table => {
      const columns = table.columns.map(col => 
        `${col.name} (${col.type}): ${col.description}${col.sampleValues ? ` [${col.sampleValues.join(', ')}]` : ''}`
      ).join('\n    ');
      
      return `Table: ${table.tableName}
  Description: ${table.description}
  Columns:
    ${columns}`;
    }).join('\n\n');

    return `You are a SQL expert. Given the following database schema and a user question, generate a precise SQL query.

DATABASE SCHEMA:
${schemaInfo}

IMPORTANT RULES:
1. Always use proper JOIN syntax when accessing multiple tables
2. Use employees table as the main table for most queries
3. For engagement data, JOIN employees e with engagement eng ON e.name = eng.name
4. For performance data, JOIN employees e with performance p ON e.emp_id = p.emp_id
5. Use DISTINCT when counting unique values
6. Use proper WHERE clauses for filtering
7. Use GROUP BY for aggregations
8. Always include COUNT, SUM, AVG as appropriate
9. Case-insensitive matching with LOWER() function when needed

EXAMPLES:
Q: "How many employees are in OneMind value stream?"
A: SELECT COUNT(*) FROM employees WHERE LOWER(team) = 'onemind' AND status = 'Active';

Q: "What is the gender ratio in my team?"
A: SELECT gender, COUNT(*) as count FROM employees WHERE status = 'Active' GROUP BY gender;

Q: "How many PhDs work in OneMind?"
A: SELECT COUNT(*) FROM employees WHERE LOWER(highest_qualification) = 'phd' AND LOWER(team) = 'onemind' AND status = 'Active';

USER QUESTION: "${userQuery}"

Generate only the SQL query, no explanation:`;
  }

  private async generateResponse(userQuery: string, sqlQuery: string, results: any[]): Promise<string> {
    try {
      // If no results, provide a helpful message
      if (!results || results.length === 0) {
        return "I couldn't find any data matching your query. Please try a different question or check if the data exists.";
      }

      // Generate natural language response based on results
      const prompt = `Given this user question and database results, provide a clear, natural language answer.

User Question: "${userQuery}"
SQL Query: ${sqlQuery}
Results: ${JSON.stringify(results, null, 2)}

Provide a conversational, informative response that directly answers the user's question. Include specific numbers and insights from the data. Keep it concise but complete.

Response:`;

      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9
        }
      });

      let generatedResponse = response.data.response.trim();
      
      // Fallback to structured response if AI response is unclear
      if (generatedResponse.length < 10 || !generatedResponse) {
        generatedResponse = this.generateStructuredResponse(userQuery, results);
      }

      return generatedResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      return this.generateStructuredResponse(userQuery, results);
    }
  }

  private generateStructuredResponse(userQuery: string, results: any[]): string {
    if (results.length === 1 && Object.keys(results[0]).length === 1) {
      // Single value result (like COUNT)
      const value = Object.values(results[0])[0];
      return `Based on your query, the result is: ${value}`;
    }

    if (results.length <= 10) {
      // Small result set - show formatted data
      const formatted = results.map(row => {
        return Object.entries(row)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      }).join('\n');

      return `Here are the results:\n${formatted}`;
    }

    // Large result set - show summary
    return `I found ${results.length} results. Here's a summary of the top entries:\n${
      results.slice(0, 5).map(row => {
        return Object.entries(row)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      }).join('\n')
    }${results.length > 5 ? '\n... and more' : ''}`;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`);
      return response.status === 200;
    } catch (error) {
      console.error('Ollama connection test failed:', error);
      return false;
    }
  }
} 