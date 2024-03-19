document.addEventListener('DOMContentLoaded', () => {
  // Fetch the visit count from the server
  const visitCountElement = document.getElementById('visitCount');
  fetch('/visitcount')
    .then((response) => response.text())
    .then((data) => {
      // Update the visit count on the webpage
      visitCountElement.textContent = data;
    })
    .catch((error) => {
      console.error('Error fetching visit count:', error);
    });
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  const eventNameInput = document.querySelector('input[name="Event"]');
  const locationInput = document.getElementById('cityInput');
  const button = document.getElementById('fetch');
  const fetchAttractionsButton = document.getElementById('fetchattractions');
  const firstPageSection = document.getElementById('firstPage');
  const hotelSection = document.getElementById('hotelSection');


  // Function to convert city input to an array if needed
  function formatCityInput(input) {
    // Check if the input contains a comma
    if (input.includes(',')) {
      // If it contains a comma, split it into an array
      return input.split(',').map(city => city.trim());
    } else {
      // If it doesn't contain a comma, convert it to an array with one element
      return [input.trim()];
    }
  }

  // Function to convert date input to the correct format
  function formatDateTimeInput(input) {
    // Check if the input is a date without time
    if (input.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Add a default time to the date (e.g., 00:00:00Z for midnight)
      return input + 'T00:00:00Z';
    } else {
      // The input is already in the correct format, so return it as is
      return input;
    }
  }

  // Function to create an event card
  function createEventCard(eventData) {
    const card = document.createElement('div');
    card.classList.add('card');

    // Create image element
    const img = document.createElement('img');
    if (eventData.images && eventData.images[0] && eventData.images[0].url) {
      img.src = eventData.images[0].url;
    } else {
      img.src = 'placeholder.jpg';
    }
    img.classList.add('card-img-top');

    // Create card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Create title
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = eventData.name;

    // Create location
    const location = document.createElement('p');
    location.classList.add('card-text');
    if (eventData._embedded && eventData._embedded.venues && eventData._embedded.venues[0] && eventData._embedded.venues[0].name && eventData._embedded.venues[0].city && eventData._embedded.venues[0].city.name) {
      location.textContent = `Location: ${eventData._embedded.venues[0].name}, ${eventData._embedded.venues[0].city.name}`;
    } else {
      location.textContent = 'Location information not available';
    }

    // Create a button to fetch YouTube videos
    const youtubeButton = document.createElement('button');
    youtubeButton.classList.add('btn', 'btn-primary', 'mt-2');
    youtubeButton.textContent = 'Show YouTube Videos';
    youtubeButton.addEventListener('click', () => {
      // Fetch and display YouTube videos here based on eventData
      fetchYouTubeVideos(eventData.name);
    });


    // Append elements to card
    card.appendChild(img);
    card.appendChild(cardBody);
    cardBody.appendChild(title);
    cardBody.appendChild(location);
    cardBody.appendChild(youtubeButton); // Add the YouTube button

    return card;
  }
  // Function to fetch YouTube videos based on the event name
  function fetchYouTubeVideos(eventName) {
    // Make an AJAX request to fetch YouTube videos based on the event name
    fetch(`/youtube?eventName=${eventName}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('YouTube Videos Data:', data);

        // Assuming youtubeDataArray is an array of YouTube video data from the API response
        const youtubeDataArray = data || [];

        // Display YouTube videos in the right column
        displayYouTubeVideos(youtubeDataArray);
      })
      .catch((error) => {
        console.error('Error fetching YouTube videos data:', error);
      });
  }

  // Function to display YouTube videos in the right column
  function displayYouTubeVideos(youtubeDataArray) {
    const youtubeContainer = document.getElementById('YoutubeContainer');
    youtubeContainer.innerHTML = ''; // Clear previous YouTube videos

    youtubeDataArray.forEach((youtubeData) => {
      // Create elements to display YouTube video (e.g., iframe)
      const videoFrame = document.createElement('iframe');
      videoFrame.setAttribute('width', '100%');
      videoFrame.setAttribute('height', '315');
      videoFrame.setAttribute('src', youtubeData.embedUrl);
      videoFrame.setAttribute('frameborder', '0');
      videoFrame.setAttribute('allowfullscreen', 'true');

      // Create a div to contain the video
      const videoDiv = document.createElement('div');
      videoDiv.classList.add('mb-3');
      videoDiv.appendChild(videoFrame);

      // Append the video div to the YouTube container
      youtubeContainer.appendChild(videoDiv);
    });
  }

  // Event listener for the 'click' event on the fetch button
  button.addEventListener('click', () => {
    // Get values from user inputs
    const eventName = eventNameInput.value;
    const startDateVal = formatDateTimeInput(startDate.value);
    const endDateVal = formatDateTimeInput(endDate.value);
    const location = formatCityInput(locationInput.value);

    // Make an AJAX request to your server with the user's input
    fetch(`/ticketmaster/events?startDate=${startDateVal}&endDate=${endDateVal}&eventName=${eventName}&location=${location}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Ticketmaster Data:', data);

        // Assuming eventDataArray is an array of event data from the API response
        const eventDataArray = data || [];

        // Display event cards
        displayEventData(eventDataArray);

        // Fetch news based on the first event (you can modify this logic as needed)

      })
      .catch((error) => {
        console.error('Error fetching Ticketmaster data:', error);
      });
  });


  // Event listener for the 'change' event on the start date input
  startDate.addEventListener('change', (e) => {
    const startDateVal = e.target.value;
    document.getElementById('startDateSelected').innerText = startDateVal;
  });

  // Event listener for the 'change' event on the end date input
  endDate.addEventListener('change', (e) => {
    const endDateVal = e.target.value;
    document.getElementById('endDateSelected').innerText = endDateVal;
  });



  // Function to display event cards
  function displayEventData(eventDataArray) {
    const eventsContainer = document.getElementById('eventsContainer');
    eventsContainer.innerHTML = ''; // Clear previous event cards

    eventDataArray.forEach((eventData) => {
      const eventCard = createEventCard(eventData);
      eventsContainer.appendChild(eventCard);
    });
  }

  function createSuggestionCard(data) {
    // Create a container div for each attraction
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('attraction-card'); // You can add a CSS class for styling

    // Create an element for the title
    const titleElement = document.createElement('h2');
    titleElement.textContent = data.title;

    // Create an element for the secondary text
    const secondaryTextElement = document.createElement('p');
    secondaryTextElement.textContent = data.secondaryText;

    // Create an image element for the image URL
    const imageElement = document.createElement('img');
    if (data.imageUrl) { // Check if imageUrl exists
      imageElement.src = data.imageUrl;
      imageElement.alt = data.title; // Provide alt text for accessibility
      cardDiv.appendChild(imageElement);
    }
    const wikimediabutton = document.createElement('button');
    wikimediabutton.classList.add('btn', 'btn-primary', 'mt-2');
    wikimediabutton.textContent = 'Show Interesting facts';
    wikimediabutton.addEventListener('click', () => {
      const hotelName = data.title; // Assuming data.title contains the hotel name

      // Fetch interesting facts data for the specific hotel
      fetchInterestingFacts(hotelName);
    });
    // Append the map button to the card container
    cardDiv.appendChild(wikimediabutton);


    // Append the title and secondary text to the card container
    cardDiv.appendChild(titleElement);
    cardDiv.appendChild(secondaryTextElement);

    return cardDiv;
  }

  // Function to display attractions in the attractions section
  function displayAttractions(attractionsData) {
    const attractionsContainer = document.getElementById('hotelsColumn');
    attractionsContainer.innerHTML = '';

    // Assuming the actual attraction data is in attractionsData.data
    attractionsData.data.forEach((attraction) => {
      const title = attraction.title.replace(/<[^>]*>/g, ''); // Remove HTML tags
      const secondaryText = attraction.secondaryText;
      const imageUrlTemplate = attraction.image?.urlTemplate; // Use optional chaining in case some entries don't have the image

      // Create the attraction card
      const attractionCard = createSuggestionCard({
        title: title,
        secondaryText: secondaryText,
        imageUrl: imageUrlTemplate?.replace('{width}', '300').replace('{height}', '200') // Replace with desired width and height
      });

      attractionsContainer.appendChild(attractionCard);
    });
  }
  fetchAttractionsButton.addEventListener('click', () => {
    // Hide the events and YouTube section
    console.log('Button Clicked');
    firstPageSection.style.display = 'none';

    // Show the attractions section
    hotelSection.style.display = 'flex';

    // Call a function to fetch and display attractions based on the Travel Advisor API response
    fetchAndDisplayAttractions();
  });

  // Function to fetch and display attractions based on the Travel Advisor API response
  function fetchAndDisplayAttractions() {
    // Get the city name from the user input
    const cityName = locationInput.value;

    // Make an AJAX request to your server with the user's input
    fetch(`/hotels/searchLocation?query=${cityName}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Travel Advisor Data:', data);


        const attractionsDataArray = data || [];

        // Display attractions
        displayAttractions(attractionsDataArray);
      })
      .catch((error) => {
        console.error('Error fetching Travel Advisor data:', error);
      });
  }
  function displayInterestingFacts(interestingFactsData) {
    const wikiColumn = document.getElementById('wiki'); 

    // Clear any previous content
    wikiColumn.innerHTML = '';

    // Display the title
    const titleElement = document.createElement('h2');
    titleElement.textContent = interestingFactsData.description;
    wikiColumn.appendChild(titleElement);

    // Display the extract
    const extractElement = document.createElement('p');
    extractElement.textContent = interestingFactsData.extract;
    wikiColumn.appendChild(extractElement);

    // Display the original image
    const imageElement = document.createElement('img');
    imageElement.src = interestingFactsData.originalimage.source;
    imageElement.alt = interestingFactsData.title; // Provide alt text for accessibility
    imageElement.width = 300;
    imageElement.height = 200;
    wikiColumn.appendChild(imageElement);
  }

  function fetchInterestingFacts(hotelName) {
    // Make an AJAX request to your server to fetch interesting facts
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hotelName)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch interesting facts');
        }
        return response.json();
      })
      .then((data) => {
        // Handle the data here
        console.log('Fetched interesting facts:', data);
        const factsdata = data || [];
        displayInterestingFacts(factsdata);

      })
      .catch((error) => {
        console.error('Error fetching interesting facts:', error);
        // Handle errors here
      });
  }

});
