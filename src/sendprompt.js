import React, { useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "./sendprompt.css"
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);


  
function PromptApp() {
  const [prompt, setPrompt] = useState('');
  const [chartDat, setchartDat] = useState({});
  const csvFileInput = useRef(null);
  const graphContainer = useRef(null);
  const predictionResult = useRef(null);
  const downloadButton = useRef(null);
  const [file, setFile] = useState(null);
  const[done,setdone] = useState(0);
  const[dataw,setdataw]=useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);  // Set the selected file to state
};
    

const generateChartData = (dataArray) => {
  return {
    labels: ['Mildly Negative', 'Mildly Positive', 'Neutral', 'Strongly negative', 'Strongly positive'], // You can define default or dynamic labels
    datasets: [
      {
        data: dataArray, // Accept only data array
      },
    ],
  };
};



  
  
  // Chart data
  const data = {
    labels: ['Mildly Negative', 'Mildly Positive', 'Neutral', 'Strongly negative', 'Strongly positive'],
    datasets: [
      {
       
        data: [3403,6520,16471,1057,5945],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

// Chart options (optional)
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      
    },
    tooltip: {
      enabled: true,
    },
  },
};


const handleUpload = async () => {
  if (file) {
      const formData = new FormData();
      formData.append('file', file);  // Append the file to the FormData object

      try {
          const response = await fetch('http://localhost:5000/predict', {
              method: 'POST',
              body: formData,  // Send the file in the POST request
          });

          if (response.ok) {
              // Create a blob from the response
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);

              // Create a download link and trigger a download
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.setAttribute('download', 'processed_file.csv');  // Filename for download
              document.body.appendChild(link);
              link.click();
              link.remove();
              
              // Cleanup after download
              setdone(1)

          } else {
              console.error('Failed to generate response');
          }

          const data = await fetch('http://localhost:5000/freq', {
            method: 'POST',
            body: formData,  // Send the file in the POST request
          });
          
          // Check if the response is successful
          if (data.ok) {
            const jsonData = await data.json();  // Wait for the JSON to be parsed
            console.log(jsonData);  // Log the actual object part
            const valArr = Object.values(jsonData)
            console.log(valArr)
            setdataw(valArr)
            const chartData = generateChartData(dataw);
            setchartDat(chartData);
            console.log(chartDat)

          } 
          else {
            console.error('Error:', data.statusText);  // Handle errors (optional)
          }

        }
      catch (error) {
          console.error('Error:', error);
      }
      }
   else {
      alert('Please select a file to upload');
  }
};
  const predict = () => {
    
    if (prompt.trim() !== "") {
      fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "text": prompt.trim() }),
      })
        .then(response => response.json())
        .then(data => {
          predictionResult.current.innerHTML = predictionResult.current.innerHTML = "<p style='font-size: 8rem; color:rgba(36, 255, 0, 1);'>Predicted sentiment: " + data.prediction[1] + "</p>";
          
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }
  

  // const displayGraph = (graphData) => {
  //   predictionResult.current.innerHTML = "";
  //   const graphUrl = "data:image/png;base64," + graphData;
  //   const img = document.createElement('img');
  //   img.src = graphUrl;
  //   graphContainer.current.appendChild(img);
  // };
  }
  return (
    <div className='dick'>
      <h1 className='head'>
        SENTIMENT ANALYSIS : DECODING EMOTIONS
        </h1>
        <p className='or'>Or,</p>
      <div className='top-wave'>
        

      </div>
      <input
        className='input-txt'
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        style={{ marginRight: '10px' }}
      />

      <input className='input-csv' type="file" ref={csvFileInput} onChange={handleFileChange} accept=".csv" style={{ marginRight: '10px' }} />

      <button className='prompt' onClick={predict}>Send Prompt</button>
      <button className='csv-upload' onClick={handleUpload}>Upload & Process CSV</button>
      <div className='Result-ani' ref={predictionResult} style={{ marginTop: '20px' }}>
      <div className="chartdiv">
      
      {/* <Pie data={data} options={options} />  */}
      </div>
</div>
    </div>
  );

}

export default PromptApp;
