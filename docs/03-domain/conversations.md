# Conversations and Messages

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

A conversation is a UX collaboration thread, not the sole unit of AI execution.

Conversation owns ordered messages and references one or more runs. A message may be user input, assistant-visible output, system status or tool/approval presentation artifact; sensitive internal runtime artifacts need not be exposed as normal chat messages.

Message content should support structured parts (text, citation, file reference, status, proposed action) rather than storing everything as one Markdown string.

Conversation memory policy determines how previous messages are summarized/selected into later run context. The runtime should not automatically send the entire transcript forever.
