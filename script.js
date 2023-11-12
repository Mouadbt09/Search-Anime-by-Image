const result=document.querySelector('.results')
const imageUrl = document.querySelector('#image').value;
function send(e){
    const imageUrl = document.querySelector('#image').value;

    if(!imageUrl) {
        alert('Please enter an image URL');
        return;
    }
    else{
        result.innerHTML = "<h2>Loading...</h2>";

        if(!imageUrl) {
            alert('Please enter an image URL');
            return;
          }
          else{
            // Fetch anime data from the API
            fetch(`https://api.trace.moe/search?anilistInfo&url=${imageUrl}`)
            .then(res => {
                if(!res.ok) {
                  throw new Error("Network response was not OK");
                  console.log('jfhffjhgf')
                    console.log('Error:', error);
                }
                return res.json();
              })
            .then(data => {
                result.innerHTML=`
                <div class="info">
                  <div class='image'>
                    <h3>You searched for: </h3>
                    <img src="${imageUrl}" alt="" />
                  </div>
                  <div class='message'>
                    <p style='margin:0px;'>
                    <span>
                      <img width="15" height="15" src="https://img.icons8.com/ios/50/FFFFFF/info--v1.png" alt="info--v1"/>
                      <strong>Info:</strong>
                    </span>
                      The first result is usually the correct anime you are looking for 
                    </p>
                    <p>
                      Similarity lower than 90% are most likely incorrect results. It's up to you to judge what is a match and what is just visually similar.
                    </p>
                  </div>
                </div>
                `
                if(data.result){
                    // Loop through the data array
                    data.result.forEach((item) => {
                      console.log(item)
                      document.querySelector(".results").innerHTML+=`
              
                          <div class="result">
                              <div>
                                <video width="400" controls>
                                    <source src="${item.video}" type="video/mp4">
                                </video>
                              </div>
                              <div class='data'>
                                  <h2>${item.anilist.title.romaji}</h2>
                                  <div class='title'>
                                    <p><strong>Native title:</strong> ${item.anilist.title.native}</p>
                                    <p><strong>Omaji title:</strong> ${item.anilist.title.english}</p>
                                  </div>
                                  <p>Episode: ${item.episode}</p>
                                  <div class='time'>
                                      <span>From: ${convertSecondsToTime(item.from)}</span>
                                      <span>To: ${convertSecondsToTime(item.to)}</span>
                                  </div>
                                  <div class='similarity'>
                                    Similarity 
                                    <div class="mask"
                                    style='background: radial-gradient( closest-side, #05062d 79%, transparent 100% ), conic-gradient(#4c00ff ${(item.similarity * 100).toFixed(2)}%, #7b00ff2a 0);'        
                                    >
                                      <small>${(item.similarity * 100).toFixed(1)}%</small>
                                    </div>
                                  </div>
                                     
                              </div>
                          </div>
                        `
                    });
                  }
        
            })
            // catch errors
            .catch(error => {
                // throw  error;
                console.log('jfhffjhgf')
                console.log('Error:', error);
                // Create the HTML content for the error messages
                const errorMessages = [
                    { status: 400, cause: 'Invalid image URL / Failed to process image / OpenCV: Failed to detect and cut borders' },
                    { status: 402, cause: 'Search quota depleted / Concurrency limit exceeded' },
                    { status: 403, cause: 'Invalid API key' },
                    { status: 405, cause: 'Method Not Allowed' },
                    { status: 500, cause: 'Internal Server Error' },
                    { status: 503, cause: 'Search queue is full / Database is not responding' },
                    { status: 504, cause: 'Server is overloaded' }
                ];

                let errorMessageHTML = '';

                if(error.status) {  
                    const matchedError = errorMessages.find(msg => msg.status === error.status);

                    errorMessageHTML = `
                    <p>
                        <div class="message">
                        HTTP Status ${matchedError.status}: ${matchedError.cause} 
                        </div>
                    </p>
                    `;

                } else {
                    errorMessageHTML = `
                    <p>Unknown error occurred</p>
                    `;
                }

                // Set the HTML content  
                result.innerHTML = errorMessageHTML;

                console.log(errorMessageHTML);
            });

            // Function to convert seconds to time format [00:12:04]
            function convertSecondsToTime(totalSeconds) {
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = Math.floor(totalSeconds % 60);
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
          }

    }
}