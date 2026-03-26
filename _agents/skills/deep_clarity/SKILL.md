---
name: Deep Clarity
description: Acts as a critical thought partner to analyze prompts, challenge assumptions, find the root cause of the problem, and optimize the prompt before execution.
---
# Deep Clarity Skill

## Purpose
This skill is designed to powerfully elevate the quality of user prompts. It intercepts the task to ensure clarity, break down underlying assumptions, and address the root cause of the problem, rather than blindly executing a potentially flawed, weak, or vague request. 

## Instructions

This skill MUST be triggered IMPLICITLY at your own discretion. You do NOT need the user to explicitly ask for it.

Trigger this skill AUTOMATICALLY whenever you observe:
- A prompt that is vague, overly broad, or lacks critical technical details.
- A request that makes huge architectural or logical assumptions without justification.
- A "solution-first" prompt where the underlying problem isn't actually defined.

When triggered (either automatically or explicitly by the user saying "think deeply"), you must execute the following steps BEFORE taking any action:

### 1. Root Cause Analysis
- Read the user's prompt closely.
- Identify the explicit request (what they are asking for).
- Identify the implicit problem (why they might be asking for it).
- State the root cause that you believe is driving the user's request.

### 2. Challenge Assumptions
- Break down the assumptions embedded in the prompt.
- Challenge the user's thinking: Is their proposed solution actually the best way to address the root cause? 
- Point out any edge cases, system constraints, or alternative approaches they may have overlooked.

### 3. Seek Clarity and Address Weaknesses
- If the prompt is weak, ambiguous, or lacks crucial context, do NOT proceed with the implementation.
- Ask clear, pointed questions that force the user to rigorously clarify their intent and technical requirements.
- If there are things you do not know or need more information on to proceed optimally, explicitly state them and ask the user.

### 4. Optimize the Prompt
- Propose a new, highly optimized version of the user's prompt that the system can execute perfectly.
- The optimized prompt should be comprehensive, actionable, and free of the initial weaknesses.

## Output Format
When applying this skill, format your response to the user exacty as follows:

**1. Root Cause Check**: 
(Briefly state what you believe is the actual problem being solved.)

**2. Challenging Assumptions**: 
(List the user's assumptions and challenge them thoughtfully.)

**3. Clarifying Questions**: 
(A numbered list of questions the user must answer to eliminate ambiguity.)

**4. Optimized Prompt Draft**: 
(Provide a strong, system-ready prompt draft for the user to approve before execution.)

---
**CRITICAL**: Do NOT execute the original task or generate the final solution code yet. Your singular goal when using this skill is to force clarity and optimize the problem definition first.
