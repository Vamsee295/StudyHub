const fs = require('fs');
const ts = require('typescript');
const path = require('path');

const dir = '../frontend/lib/data/courses';
const files = fs.readdirSync(dir)
  .filter(f => f.startsWith('programming-fundamentals-content') && f.endsWith('.ts'))
  .map(f => path.join(dir, f));

function processFile(filePath) {
  let sourceText = fs.readFileSync(filePath, 'utf-8');
  let sourceFile = ts.createSourceFile(filePath, sourceText, 99, true);

  // We want to transform the AST
  const transformer = (context) => (rootNode) => {
    function visit(node) {
      // Look for `content: { ... }` where it has legacy fields like `definition`
      if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === 'content') {
        const init = node.initializer;
        if (ts.isObjectLiteralExpression(init)) {
          const props = init.properties;
          const hasDefinition = props.some(p => p.name && ts.isIdentifier(p.name) && p.name.text === 'definition');
          
          if (hasDefinition) {
            // We found a legacy content object. Let's build the sections array!
            let defNode, whyNode, coreNode, syntaxNode, codeNode, howNode, realNode, mistakesNode, interviewNode, revisionNode, promptNode, quickCheckNode;

            props.forEach(p => {
              if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name)) {
                switch (p.name.text) {
                  case 'definition': defNode = p.initializer; break;
                  case 'whyItMatters': whyNode = p.initializer; break;
                  case 'coreConcept': coreNode = p.initializer; break;
                  case 'syntax': syntaxNode = p.initializer; break;
                  case 'javaExample': codeNode = p.initializer; break;
                  case 'howItWorks': howNode = p.initializer; break;
                  case 'realWorldUse': realNode = p.initializer; break;
                  case 'commonMistakes': mistakesNode = p.initializer; break;
                  case 'interviewQuestions': interviewNode = p.initializer; break;
                  case 'quickRevision': revisionNode = p.initializer; break;
                  case 'practicePrompt': promptNode = p.initializer; break;
                  case 'quickCheck': quickCheckNode = p.initializer; break;
                }
              }
            });

            // Helper to create object literal
            const createSection = (type, title, additionalProps) => {
              const objProps = [
                ts.factory.createPropertyAssignment("type", ts.factory.createStringLiteral(type)),
                ts.factory.createPropertyAssignment("title", ts.factory.createStringLiteral(title))
              ];
              for (const [k, v] of Object.entries(additionalProps)) {
                if (v) objProps.push(ts.factory.createPropertyAssignment(k, v));
              }
              return ts.factory.createObjectLiteralExpression(objProps, true);
            };

            const sections = [];

            if (defNode) sections.push(createSection("text", "Concept", { content: defNode }));
            if (whyNode) sections.push(createSection("callout", "Why It Matters", { content: whyNode }));
            if (coreNode) sections.push(createSection("text", "Core Concept", { content: coreNode }));
            
            // Code block
            if (codeNode) {
              sections.push(createSection("code", "Syntax & Example", {
                code: codeNode,
                explanation: syntaxNode
              }));
            } else if (syntaxNode) {
              sections.push(createSection("text", "Syntax", { content: syntaxNode }));
            }

            if (howNode) sections.push(createSection("text", "How It Works", { content: howNode }));
            if (realNode) sections.push(createSection("text", "Real World Use", { content: realNode }));
            if (mistakesNode) sections.push(createSection("warning", "Common Mistakes", { items: mistakesNode }));
            
            if (interviewNode && ts.isArrayLiteralExpression(interviewNode)) {
              // Map {question, answer} to {question, trap, solution}
              const traps = ts.factory.createArrayLiteralExpression(
                interviewNode.elements.map(el => {
                  if (ts.isObjectLiteralExpression(el)) {
                    let q, a;
                    el.properties.forEach(p => {
                      if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name)) {
                        if (p.name.text === 'question') q = p.initializer;
                        if (p.name.text === 'answer') a = p.initializer;
                      }
                    });
                    return ts.factory.createObjectLiteralExpression([
                      ts.factory.createPropertyAssignment("question", q || ts.factory.createStringLiteral("")),
                      ts.factory.createPropertyAssignment("trap", ts.factory.createStringLiteral("")),
                      ts.factory.createPropertyAssignment("solution", a || ts.factory.createStringLiteral(""))
                    ], true);
                  }
                  return el;
                }),
                true
              );
              sections.push(createSection("interviewTraps", "Interview Traps", { traps }));
            }

            if (revisionNode) {
              sections.push(createSection("takeaways", "Key Takeaways", {
                items: ts.factory.createArrayLiteralExpression([revisionNode])
              }));
            }

            if (promptNode) {
              sections.push(createSection("think", "Practice Prompt", {
                question: promptNode,
                answerReveal: ts.factory.createStringLiteral("Try implementing this in your preferred IDE!")
              }));
            }

            if (quickCheckNode && ts.isObjectLiteralExpression(quickCheckNode)) {
              const qcProps = [
                ts.factory.createPropertyAssignment("type", ts.factory.createStringLiteral("quickCheck"))
              ];
              quickCheckNode.properties.forEach(p => qcProps.push(p));
              sections.push(ts.factory.createObjectLiteralExpression(qcProps, true));
            }

            const sectionsArray = ts.factory.createArrayLiteralExpression(sections, true);
            const newContentObj = ts.factory.createObjectLiteralExpression([
              ts.factory.createPropertyAssignment("sections", sectionsArray)
            ], true);
            
            return ts.factory.createPropertyAssignment(node.name, newContentObj);
          }
        }
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
  };

  const result = ts.transform(sourceFile, [transformer]);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const transformedCode = printer.printNode(ts.EmitHint.Unspecified, result.transformed[0], sourceFile);
  
  fs.writeFileSync(filePath, transformedCode);
  console.log(`Transformed ${filePath}`);
}

files.forEach(processFile);
