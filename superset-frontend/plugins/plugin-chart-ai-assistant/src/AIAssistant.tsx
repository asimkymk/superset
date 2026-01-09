import React, { useState, useEffect } from 'react';
import { styled, SupersetClient } from '@superset-ui/core';
import { AIAssistantProps, Message } from './types';

const Styles = styled.div<{ height: number; width: number }>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  overflow-y: auto;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.grayscale.light5};
  border: 1px solid ${({ theme }) => theme.colors.grayscale.light2};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const ChatHistory = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const MessageBubble = styled.div<{ role: 'user' | 'ai' }>`
  background-color: ${({ role, theme }) =>
    role === 'user' ? theme.colors.primary.light4 : theme.colors.grayscale.light3};
  padding: 8px 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  max-width: 80%;
  align-self: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
  margin-left: ${({ role }) => (role === 'user' ? 'auto' : '0')};
  margin-right: ${({ role }) => (role === 'ai' ? 'auto' : '0')};
`;

const InputArea = styled.div`
  display: flex;
  gap: 10px;
`;

const TextArea = styled.textarea`
  flex-grow: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
  height: 40px;
`;

const Button = styled.button`
  padding: 0 16px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary.base};
  color: white;
  border: none;
  cursor: pointer;
  &:disabled {
    background-color: ${({ theme }) => theme.colors.grayscale.light2};
    cursor: not-allowed;
  }
`;

export default function AIAssistant(props: AIAssistantProps) {
  const { height, width } = props;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboardContext, setDashboardContext] = useState<any>({});

  // Attempt to gather context from the dashboard if possible.
  // In a real implementation, we would access Redux state or Props passed down
  // to get access to other charts.
  // For MVP, we'll try to look at window.superset or similar if available,
  // or just pass what we have.
  useEffect(() => {
    // This is a placeholder for gathering context.
    // In Superset, plugins are somewhat isolated.
    // We might need to rely on the user dragging this plugin into a dashboard
    // and the backend handling context retrieval via dashboard_id if we pass it.
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call the backend API
      const response = await SupersetClient.post({
        endpoint: '/api/v1/llm/ask',
        jsonPayload: {
          question: userMsg.content,
          context: {
            // We can pass dashboard ID or some client-side data here if available
            ...dashboardContext
          }
        },
      });

      const aiMsg: Message = {
        role: 'ai',
        content: response.json.result
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: 'Error: Could not fetch response.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Styles height={height} width={width}>
      <h3>AI Assistant</h3>
      <ChatHistory>
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role}>
            <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong> {m.content}
          </MessageBubble>
        ))}
        {loading && <div>Thinking...</div>}
      </ChatHistory>
      <InputArea>
        <TextArea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about your dashboard..."
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </InputArea>
    </Styles>
  );
}
