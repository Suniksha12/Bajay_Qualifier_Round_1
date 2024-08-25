import React, { useState } from 'react';

function App() {
  const [inputData, setInputData] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jsonInput = JSON.parse(inputData); // Validate JSON format
      const response = await fetch('http://localhost:5000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonInput),
      });
      const data = await response.json();
      setResponseData(data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON format or server error');
    }
  };

  const handleSelectChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(options);
  };

  const filteredResponse = () => {
    if (!responseData) return null;

    const filtered = {};
    if (selectedOptions.includes('Alphabets')) filtered.alphabets = responseData.alphabets;
    if (selectedOptions.includes('Numbers')) filtered.numbers = responseData.numbers;
    if (selectedOptions.includes('Highest lowercase alphabet'))
      filtered.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;

    return filtered;
  };

  return (
    <div className="App">
      <h1>Your Roll Number</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder='Enter JSON data here...'
        ></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {responseData && (
        <div>
          <h3>Filter Response:</h3>
          <select multiple onChange={handleSelectChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>
      )}

      {filteredResponse() && (
        <div>
          <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
