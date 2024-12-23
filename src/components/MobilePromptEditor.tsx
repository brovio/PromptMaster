// Update the handleRun function in MobilePromptEditor.tsx

const handleRun = async () => {
  if (!content.trim() || !selectedModelId || !selectedTemplateId || !user) return;
  
  try {
    setProcessing(true);
    const startTime = Date.now();

    const apiKey = apiKeys.find(k => k.provider === 'openrouter')?.key_value;
    if (!apiKey) throw new Error('OpenRouter API key not found');

    const template = getTemplate(selectedTemplateId);
    if (!template) throw new Error('Template not found');

    const improvedContent = await PromptService.improvePrompt(
      content,
      selectedModelId,
      apiKey,
      template.systemPrompt
    );

    // Calculate metrics
    const endTime = Date.now();
    const metrics = {
      tokens: Math.round(content.length / 4), // Rough estimate
      cost: 0.000001 * Math.round(content.length / 4), // Example calculation
      time: (endTime - startTime) / 1000 // Convert to seconds
    };

    setMetrics(metrics);

    // Save the prompt with all required data
    await PromptService.savePrompt({
      userId: user.id,
      content,
      modelId: selectedModelId,
      templateId: selectedTemplateId,
      result: improvedContent,
      metrics
    });

    onTest?.(improvedContent);
  } catch (err) {
    console.error('Error processing prompt:', err);
  } finally {
    setProcessing(false);
  }
};