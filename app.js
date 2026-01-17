// Data storage
let rooms = JSON.parse(localStorage.getItem('rooms')) || [];
let currentRoomId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadRooms();
    setupModal();
    addSampleData();
});

// Add sample data on first load
function addSampleData() {
    if (rooms.length === 0) {
        const sampleRooms = [
            { id: 1, number: '101', status: 'Dirty', staff: 'Maria', notes: 'Guest checkout morning', priority: false },
            { id: 2, number: '102', status: 'Cleaning', staff: 'John', notes: '', priority: false },
            { id: 3, number: '103', status: 'Inspecting', staff: 'Sofia', notes: 'Check AC unit', priority: false },
            { id: 4, number: '104', status: 'Ready', staff: 'Maria', notes: '', priority: false },
            { id: 5, number: '105', status: 'Ready', staff: 'Ahmed', notes: '', priority: false },
            { id: 6, number: '201', status: 'Dirty', staff: 'Rosa', notes: 'VIP guest - messy room', priority: true },
            { id: 7, number: '202', status: 'Cleaning', staff: 'Sofia', notes: '', priority: false },
            { id: 8, number: '203', status: 'Ready', staff: 'John', notes: '', priority: false },
        ];
        rooms = sampleRooms;
        saveRooms();
        loadRooms();
    }
}

// Add new room
function addRoom() {
    const roomNumber = document.getElementById('roomNumber').value.trim();
    const staff = document.getElementById('staff').value;
    const notes = document.getElementById('notes').value.trim();
    const priority = document.getElementById('priority').checked;

    if (!roomNumber) {
        alert('Please enter a room number');
        return;
    }

    // Check if room already exists
    if (rooms.some(r => r.number === roomNumber)) {
        alert('Room already exists!');
        return;
    }

    const newRoom = {
        id: Math.max(0, ...rooms.map(r => r.id)) + 1,
        number: roomNumber,
        status: 'Dirty',
        staff: staff || 'Unassigned',
        notes: notes,
        priority: priority
    };

    rooms.push(newRoom);
    saveRooms();
    loadRooms();

    // Clear form
    document.getElementById('roomNumber').value = '';
    document.getElementById('staff').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('priority').checked = false;

    alert(`Room ${roomNumber} added successfully!`);
}

// Load and display rooms
function loadRooms() {
    // Clear all columns
    document.getElementById('ready').innerHTML = '';
    document.getElementById('cleaning').innerHTML = '';
    document.getElementById('inspecting').innerHTML = '';
    document.getElementById('dirty').innerHTML = '';

    // Update stats
    updateStats();

    // Sort rooms by number
    const sortedRooms = [...rooms].sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
    });

    // Display rooms in appropriate columns
    sortedRooms.forEach(room => {
        const roomCard = createRoomCard(room);
        const columnId = room.status.toLowerCase();
        const column = document.getElementById(columnId);
        if (column) {
            column.appendChild(roomCard);
        }
    });
}

// Create room card element
function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = 'room-card';
    card.onclick = () => openRoomModal(room);

    const priorityBadge = room.priority ? '<span class="priority">⭐ VIP</span>' : '';
    const staffBadge = room.staff ? `<span class="staff">${room.staff}</span>` : '';
    const notesSection = room.notes ? `<div class="notes">${room.notes}</div>` : '';

    card.innerHTML = `
        <h4>Room ${room.number}</h4>
        <p>${staffBadge} ${priorityBadge}</p>
        ${notesSection}
    `;

    return card;
}

// Update statistics
function updateStats() {
    const stats = {
        Ready: rooms.filter(r => r.status === 'Ready').length,
        Cleaning: rooms.filter(r => r.status === 'Cleaning').length,
        Inspecting: rooms.filter(r => r.status === 'Inspecting').length,
        Dirty: rooms.filter(r => r.status === 'Dirty').length
    };

    document.getElementById('countReady').textContent = stats.Ready;
    document.getElementById('countCleaning').textContent = stats.Cleaning;
    document.getElementById('countInspecting').textContent = stats.Inspecting;
    document.getElementById('countDirty').textContent = stats.Dirty;
}

// Modal handling
function setupModal() {
    const modal = document.getElementById('roomModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Open room modal
function openRoomModal(room) {
    currentRoomId = room.id;
    document.getElementById('modalRoomNumber').textContent = `Room ${room.number}`;
    document.getElementById('modalStatus').value = room.status;
    document.getElementById('modalStaff').value = room.staff;
    document.getElementById('modalNotes').value = room.notes;
    document.getElementById('modalPriority').checked = room.priority;

    document.getElementById('roomModal').style.display = 'block';
}

// Update room
function updateRoom() {
    const room = rooms.find(r => r.id === currentRoomId);
    if (!room) return;

    room.status = document.getElementById('modalStatus').value;
    room.staff = document.getElementById('modalStaff').value || 'Unassigned';
    room.notes = document.getElementById('modalNotes').value;
    room.priority = document.getElementById('modalPriority').checked;

    saveRooms();
    loadRooms();
    document.getElementById('roomModal').style.display = 'none';
    alert('Room updated successfully!');
}

// Delete room
function deleteRoom() {
    if (confirm('Are you sure you want to delete this room?')) {
        rooms = rooms.filter(r => r.id !== currentRoomId);
        saveRooms();
        loadRooms();
        document.getElementById('roomModal').style.display = 'none';
        alert('Room deleted successfully!');
    }
}

// Save rooms to localStorage
function saveRooms() {
    localStorage.setItem('rooms', JSON.stringify(rooms));
}

// Clear all data
function clearAllData() {
    if (confirm('This will delete ALL rooms. Are you sure?')) {
        rooms = [];
        saveRooms();
        loadRooms();
        alert('All data cleared!');
    }
}
