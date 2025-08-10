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

document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.getElementById('timeline-container');

    // Group events by year
    const eventsByYear = events.reduce((acc, event) => {
        const year = new Date(event.startDate).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(event);
        return acc;
    }, {});

    // Sort years in descending order
    const sortedYears = Object.keys(eventsByYear).sort((a, b) => b - a);

    // Create and append elements for each year and event
    sortedYears.forEach(year => {
        const yearContainer = document.createElement('div');
        yearContainer.className = 'year-container';

        const yearMarker = document.createElement('div');
        yearMarker.className = 'year-marker';
        yearMarker.textContent = year;
        yearContainer.appendChild(yearMarker);

        // Sort events within the year by start date
        eventsByYear[year].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        eventsByYear[year].forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event';

            const eventName = document.createElement('div');
            eventName.className = 'event-name';
            eventName.textContent = event.name;
            eventElement.appendChild(eventName);

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
                eventLink.target = '_blank'; // Open in new tab
                eventElement.appendChild(eventLink);
            }

            yearContainer.appendChild(eventElement);
        });

        timelineContainer.appendChild(yearContainer);
    });
});
