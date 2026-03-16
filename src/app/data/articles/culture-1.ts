import { Article } from "../articles";

export const culture1: Article = {
  id: "culture-1",
  title: "Beyond Psychological Safety: Building Dense Engineering Culture and Scientific Measurement of Productivity",
  category: "Culture",
  author: "DevCard Editorial",
  date: "2026.03.11",
  readTime: "45 min",
  excerpt: "A team that is merely friendly is not necessarily a strong team. How to build a 'High-Performance Culture' that encourages constructive conflict and achieves both code quality and delivery speed. From DORA metrics to the SPACE framework.",
  blocks: [
    { type: "h2", content: "1. Coexistence of Psychological Safety and 'High-Power Feedback'" },
    { type: "text", content: "Since Google's 'Project Aristotle,' the importance of psychological safety has become widely known. However, in many workplaces, this concept is misinterpreted as 'being nice to each other and not saying harsh things.' True psychological safety refers to a state where 'to maximize team outcomes, anyone can speak frankly to anyone without fear of risk.'" },
    { type: "text", content: "In a dense engineering culture, code review and architecture discussion venues are not places to deny personality, but arenas of 'constructive combat' to pursue technical optimal solutions. What supports this culture is deep respect for each other's technical ability and the common recognition that 'we are comrades trying to solve the same problem.'" },
    { type: "h3", content: "'Protocols' to Foster a Healthy Feedback Culture" },
    { type: "list", content: ["**Be Hard on Issues, Soft on People**: Always fix the target of criticism on 'code' or 'design,' not on individual ability or personality.", "**Ask-Ask Principle**: Not only the person giving feedback actively asks 'How do you think this can be improved?'", "**Public Praise, Private Criticism**: Conduct wonderful achievements and knowledge sharing in a place visible to everyone, and conduct serious correction requests for specific individuals in closed venues like 1-on-1s."] },
    { type: "tip", content: "'Silence' is the biggest liability for a team. When everyone agrees in a meeting, it may be a sign that someone has stopped thinking or is afraid to speak their opinion." },
    { type: "h2", content: "2. Scientific Approach to Productivity: DORA Metrics and SPACE Framework" },
    { type: "text", content: "To manage something formless like 'culture,' it must be translated into measurable indicators as 'results of behavior.' There used to be misguided attempts to evaluate engineers by 'commit count,' but in modern engineering organizations, productivity is captured from both aspects of overall system performance and developer well-being." },
    { type: "text", content: "One of the most trusted indicators is the four key metrics proposed by DORA (DevOps Research and Assessment). These show not just speed but the balance with quality objectively. Furthermore, recently, the movement to capture productivity from multi-faceted perspectives through the SPACE framework has become mainstream." },
    { type: "quote", content: "What cannot be measured cannot be improved. However, measuring the wrong things brings worse results than doing nothing." },
    { type: "h3", content: "How to Read the DORA Four Key Metrics" },
    { type: "list", content: ["**Deployment Frequency**: How frequently the organization delivers value to customers. High-frequency deployment means each change is small and risk is distributed.", "**Lead Time for Changes**: Time from when code is committed until it runs in production. The shorter this time, the faster the feedback loop.", "**Change Failure Rate**: The percentage of incidents caused by production deployments. This monitors whether quality is being sacrificed in pursuit of speed.", "**Mean Time to Restore (MTTR)**: How quickly you can recover when service interruption occurs. This tells the story of the organization's 'resilience.'"] },
    { type: "h2", content: "3. Learning Organization: Pursuit of Technical Excellence" },
    { type: "text", content: "The ultimate purpose of engineering culture is to create a state where individual engineers continue to grow and their collective intelligence becomes organizational assets. For that, 'learning' must be embedded in daily development work. Allocating 10% of work hours to free research and development, holding weekly internal study sessions, fully subsidizing participation in external conferences. These are 'survival strategies' to maintain organizational competitiveness." },
    { type: "warning", content: "Culture cannot be forced. What leaders can do is encourage desirable behavior, remove barriers that hinder it, and behave themselves as embodiments of that culture." },
    { type: "link", content: "Strategic Control of Technical Debt Supporting Dense Culture", targetId: "leadership-1" }
  ]
};
