document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playlist = document.getElementById('playlist');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let currentTrackIndex = 0;
    let playlistData = [];

    // Function to load and play a track
    function playTrack(index) {
        if (index >= 0 && index < playlistData.length) {
            const track = playlistData[index];
            audioPlayer.src = track.src;
            audioPlayer.play();
            updateCurrentTrack(index);
        }
    }

    // Function to update the current track in the playlist
    function updateCurrentTrack(index) {
        const playlistItems = playlist.querySelectorAll('li');
        playlistItems.forEach(item => {
            item.classList.remove('current');
        });
        playlistItems[index].classList.add('current');
    }

    // Event listener for play button
    playButton.addEventListener('click', function() {
        audioPlayer.play();
    });

    // Event listener for pause button
    pauseButton.addEventListener('click', function() {
        audioPlayer.pause();
    });

    // Event listener for previous button
    prevButton.addEventListener('click', function() {
        currentTrackIndex = (currentTrackIndex - 1 + playlistData.length) % playlistData.length;
        playTrack(currentTrackIndex);
    });

    // Event listener for next button
    nextButton.addEventListener('click', function() {
        currentTrackIndex = (currentTrackIndex + 1) % playlistData.length;
        playTrack(currentTrackIndex);
    });

    // Fetch playlist data from the server
    async function loadPlaylist() {
        try {
            const response = await fetch('/playlist');
            playlistData = await response.json();
            // Populate playlist
            playlist.innerHTML = '';
            playlistData.forEach((track, index) => {
                const li = document.createElement('li');
                li.textContent = track.title;
                li.setAttribute('data-index', index);
                li.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    playTrack(index);
                });
                playlist.appendChild(li);
            });
            // Play the first track automatically when the playlist is loaded
            playTrack(0);
        } catch (error) {
            console.error('Error loading playlist:', error);
        }
    }

    // Load playlist when the page is loaded
    loadPlaylist();
});
