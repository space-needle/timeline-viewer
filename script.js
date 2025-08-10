// 1. SUPABASE SETUP - Replace with your project details from supabase.com
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// 2. Initialize Supabase Client
// Ensure the Supabase library is loaded before this script in your HTML
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. Hardcoded event data (will be replaced by DB call later)
const events = [
    {
        name: "Trip to Korea",
        startDate: "2025-05-10",
        endDate: "2025-05-20",
        description: "A wonderful trip to Seoul and Busan.",
        photoAlbum: "https://photos.app.goo.gl/some-link",
        metadata: {
            participants: "Jules, User"
        }
    },
    {
        name: "Picnic",
        startDate: "2025-04-15",
        endDate: "2025-04-15",
        description: "A lovely picnic in the park.",
        photoAlbum: "https://photos.app.goo.gl/some-link",
        metadata: {}
    },
    {
        name: "Camping",
        startDate: "2024-08-20",
        endDate: "2024-08-22",
        description: "Camping trip to the mountains.",
        photoAlbum: "https://photos.app.goo.gl/some-link",
        metadata: {}
    },
    {
        name: "Business Trip",
        startDate: "2024-02-10",
        endDate: "2024-02-12",
        description: "A trip for work.",
        photoAlbum: "",
        metadata: {
            destination: "New York"
        }
    },
    {
        name: "Christmas Light",
        startDate: "2024-01-05",
        endDate: "2024-01-05",
        description: "A trip for work.",
        photoAlbum: "",
        metadata: {
            destination: "New York"
        }
    },
    {
        name: "Trip to Swift",
        startDate: "2023-07-01",
        endDate: "2023-07-05",
        description: "A fun trip.",
        photoAlbum: "https://photos.app.goo.gl/some-link",
        metadata: {}
    },
    {
        name: "Trip to Vegas",
        startDate: "2022-11-20",
        endDate: "2022-11-25",
        description: "What happens in Vegas, stays in Vegas.",
        photoAlbum: "https://photos.app.goo.gl/some-link",
        metadata: {}
    }
];

// Helper function to get day of the year (1-366)
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT REFERENCES ---
    const timelineContainer = document.getElementById('timeline-container');
    const zoomToggle = document.getElementById('zoom-toggle');
    // Add Event Modal
    const addEventModal = document.getElementById('add-event-modal');
    const addEventBtn = document.getElementById('add-event-btn');
    const addEventCloseBtn = document.querySelector('#add-event-modal .close-btn');
    const addEventForm = document.getElementById('add-event-form');
    // Login Modal
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const loginCloseBtn = document.querySelector('.login-close-btn');
    const loginForm = document.getElementById('login-form');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const signupSubmitBtn = document.getElementById('signup-submit-btn');
    const authErrorEl = document.getElementById('auth-error');
    // User Info
    const userInfoEl = document.getElementById('user-info');
    const userEmailEl = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    let currentView = 'year'; // 'year' or 'month'

    // --- RENDER FUNCTIONS (Timeline) ---
    function render() {
        timelineContainer.innerHTML = ''; // Clear previous content
        if (currentView === 'year') {
            renderYearView();
        } else {
            renderMonthView();
        }
    }

    function renderYearView() {
        timelineContainer.className = 'timeline-container year-view';
        const eventsByYear = events.reduce((acc, event) => {
            const year = new Date(event.startDate).getFullYear();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(event);
            return acc;
        }, {});

        const sortedYears = Object.keys(eventsByYear).sort((a, b) => b - a);

        sortedYears.forEach(year => {
            const yearContainer = document.createElement('div');
            yearContainer.className = 'year-container';
            yearContainer.dataset.year = year;

            const yearMarker = document.createElement('div');
            yearMarker.className = 'year-marker';
            yearMarker.textContent = year;

            yearMarker.addEventListener('click', () => {
                currentView = 'month';
                zoomToggle.checked = true;
                render();

                const yearEvents = events.filter(e => new Date(e.startDate).getFullYear() == year);
                if (yearEvents.length > 0) {
                    yearEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                    const latestEvent = yearEvents[0];
                    const latestMonth = String(new Date(latestEvent.startDate).getMonth() + 1).padStart(2, '0');

                    const targetElement = document.getElementById(`month-${year}-${latestMonth}`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });

            yearContainer.appendChild(yearMarker);

            const yearDataContainer = document.createElement('div');
            yearDataContainer.className = 'year-data-container';

            const heatmapContainer = document.createElement('div');
            heatmapContainer.className = 'heatmap-container';

            const titlesContainer = document.createElement('div');
            titlesContainer.className = 'titles-container';

            eventsByYear[year].forEach(event => {
                const eventDate = new Date(event.startDate);
                const dayOfYear = getDayOfYear(eventDate);
                const isLeap = new Date(year, 1, 29).getMonth() === 1;
                const yearLength = isLeap ? 366 : 365;
                const position = (dayOfYear / yearLength) * 100;

                const dot = document.createElement('div');
                dot.className = 'heatmap-dot';
                dot.style.top = `${position}%`;
                dot.title = `${event.name} - ${event.startDate}`;
                heatmapContainer.appendChild(dot);

                const title = document.createElement('div');
                title.className = 'event-title';
                title.textContent = event.name;

                title.addEventListener('click', () => {
                    currentView = 'month';
                    zoomToggle.checked = true;
                    render();

                    const eventDate = new Date(event.startDate);
                    const year = eventDate.getFullYear();
                    const month = String(eventDate.getMonth() + 1).padStart(2, '0');

                    const targetElement = document.getElementById(`month-${year}-${month}`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });

                titlesContainer.appendChild(title);
            });

            yearDataContainer.appendChild(heatmapContainer);
            yearDataContainer.appendChild(titlesContainer);
            yearContainer.appendChild(yearDataContainer);
            timelineContainer.appendChild(yearContainer);
        });
    }

    function renderMonthView() {
        timelineContainer.className = 'timeline-container month-view';

        const eventsByMonth = events.reduce((acc, event) => {
            const eventDate = new Date(event.startDate);
            const year = eventDate.getFullYear();
            const month = String(eventDate.getMonth() + 1).padStart(2, '0');
            const key = `${year}-${month}`;

            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(event);
            return acc;
        }, {});

        const sortedMonths = Object.keys(eventsByMonth).sort().reverse();

        sortedMonths.forEach(monthKey => {
            const [year, monthNum] = monthKey.split('-');
            const monthName = new Date(year, monthNum - 1, 1).toLocaleString('default', { month: 'long' });

            const monthContainer = document.createElement('div');
            monthContainer.className = 'month-container';
            monthContainer.id = `month-${monthKey}`;

            const monthMarker = document.createElement('div');
            monthMarker.className = 'month-marker';
            monthMarker.textContent = `${monthName} ${year}`;
            monthContainer.appendChild(monthMarker);

            eventsByMonth[monthKey].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

            eventsByMonth[monthKey].forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                // ... (detailed event rendering)
                const eventName = document.createElement('div');
                eventName.className = 'event-name';
                eventName.textContent = event.name;
                eventElement.appendChild(eventName);
                // ... (and so on for dates, desc, link)
                 const eventDates = document.createElement('div');
                eventDates.className = 'event-dates';
                eventDates.textContent = `${event.startDate} - ${event.endDate}`;
                eventElement.appendChild(eventDates);

                const eventDescription = document.createElement('div');
                eventDescription.className = 'event-description';
                eventDescription.textContent = event.description;
                eventElement.appendChild(eventDescription);

                if (event.photoAlbum) {
                    const eventLink = document.createElement('a');
                    eventLink.className = 'event-link';
                    eventLink.href = event.photoAlbum;
                    eventLink.textContent = 'View Photo Album';
                    eventLink.target = '_blank';
                    eventElement.appendChild(eventLink);
                }
                monthContainer.appendChild(eventElement);
            });
            timelineContainer.appendChild(monthContainer);
        });
    }

    zoomToggle.addEventListener('change', () => {
        currentView = zoomToggle.checked ? 'month' : 'year';
        render();
    });

    // --- MODAL LOGIC (Add Event) ---
    addEventBtn.addEventListener('click', () => {
        addEventModal.style.display = 'block';
    });
    addEventCloseBtn.addEventListener('click', () => {
        addEventModal.style.display = 'none';
    });
    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Add event form submitted');
        addEventModal.style.display = 'none';
        addEventForm.reset();
    });

    // --- AUTHENTICATION LOGIC ---
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    loginCloseBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        authErrorEl.textContent = '';
    });
    loginSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        authErrorEl.textContent = '';
        const { error } = await supabase.auth.signInWithPassword({
            email: loginForm.email.value,
            password: loginForm.password.value,
        });
        if (error) {
            authErrorEl.textContent = error.message;
        } else {
            loginModal.style.display = 'none';
            loginForm.reset();
        }
    });
    signupSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        authErrorEl.textContent = '';
        const { error } = await supabase.auth.signUp({
            email: loginForm.email.value,
            password: loginForm.password.value,
        });
        if (error) {
            authErrorEl.textContent = error.message;
        } else {
            authErrorEl.textContent = 'Success! Check your email for a confirmation link.';
        }
    });
    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
    });

    // --- AUTH STATE MANAGEMENT & MODAL CLEANUP ---
    supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
            userInfoEl.style.display = 'flex';
            userEmailEl.textContent = session.user.email;
            loginBtn.style.display = 'none';
            addEventBtn.style.display = 'block';
        } else {
            userInfoEl.style.display = 'none';
            userEmailEl.textContent = '';
            loginBtn.style.display = 'block';
            addEventBtn.style.display = 'none';
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target == addEventModal) {
            addEventModal.style.display = 'none';
        }
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
            authErrorEl.textContent = '';
        }
    });

    render(); // Initial render
});
