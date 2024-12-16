const parseAiken = (fileContent) => {
    const lines = fileContent.split('\n'); // Split file content into lines
    const questions = [];
    let currentQuestion = null;
  
    lines.forEach((line) => {
      line = line.trim(); // Remove whitespace
  
      if (line === '') return; // Skip empty lines
  
      if (!line.match(/^[A-Z]\./) && !line.startsWith('ANSWER:')) {
        // This is a new question
        if (currentQuestion) {
          questions.push(currentQuestion); // Save the previous question
        }
        currentQuestion = { text: line, options: {}, answer: null }; // Initialize a new question
      } else if (line.match(/^[A-Z]\./)) {
        // This is an option
        const optionCode = line[0]; // Extract option letter (A, B, C, D, E, F, etc.)
        const optionText = line.substring(2).trim(); // Extract option text after "A. "
        if (currentQuestion) {
          currentQuestion.options[optionCode] = optionText; // Add option to the current question
        }
      } else if (line.startsWith('ANSWER:')) {
        // This is the correct answer
        const correctAnswer = line.split(':')[1].trim(); // Extract the correct answer (e.g., "C")
        if (currentQuestion) {
          currentQuestion.answer = correctAnswer;
        }
      }
    });
  
    // Push the last question if it exists
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
  
    return questions;
  };
  
  export default parseAiken;
  