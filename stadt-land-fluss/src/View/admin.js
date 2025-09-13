import React from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";

/* Emilia */
export default function AdminUserVerwaltung() {
    const navigate = useNavigate();
    const [adminEmail, setAdminEmail] = React.useState("");
    const [adminRolle, setAdminRolle] = React.useState("");
    const [adminPasswort, setAdminPasswort] = React.useState("");
    const [adminBenutzername, setAdminBenutzername] = React.useState("");
    const [adminWort, setAdminWort] = React.useState("");
    const [adminCategory, setAdminCategory] = React.useState("Stadt");
    
    // Loading und Error States
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [users, setUsers] = React.useState([]);
    const [words, setWords] = React.useState([]);
    const [successMessage, setSuccessMessage] = React.useState("");
    const [deleteModal, setDeleteModal] = React.useState({ show: false, user: null });
    const [selectedCategoryWords, setSelectedCategoryWords] = React.useState([]);
    const [editingUser, setEditingUser] = React.useState(null);
    const [editingWord, setEditingWord] = React.useState(null);

    // Admin-Berechtigung beim Laden prüfen
    React.useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:3001/api/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/login');
                        return;
                    }
                    throw new Error('Fehler bei der Admin-Prüfung');
                }

                const data = await response.json();
                console.log('Admin-Zugriff bestätigt:', data);
                setUsers(data.users || []);
                setIsLoading(false);
                
            } catch (error) {
                console.error('Admin-Access-Check Fehler:', error);
                setError('Fehler beim Überprüfen der Admin-Berechtigung');
                setIsLoading(false);
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        checkAdminAccess();
    }, [navigate]);

    // Helper: API Call mit Token
    const apiCall = async (url, options = {}) => {
        const token = localStorage.getItem('token');
        return fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    };

    // Wörter für Kategorie laden
    const loadWords = async (categoryId) => {
        try {
            const response = await apiCall(`http://localhost:3001/api/admin/words/${categoryId}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedCategoryWords(data.words || []);
            } else {
                setSelectedCategoryWords([]);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Wörter:', error);
            setSelectedCategoryWords([]);
        }
    };

    // Bei Kategorie-Wechsel automatisch Wörter laden
    React.useEffect(() => {
        if (adminCategory) {
            const categoryMap = { "Stadt": 1, "Land": 2, "Fluss": 3, "Tier": 4 };
            const categoryId = categoryMap[adminCategory];
            loadWords(categoryId);
        }
    }, [adminCategory]);

    // Loading anzeigen
    if (isLoading) {
        return (
            <div className="adminContainer">
                <div className="adminLoadingMessage">
                    Überprüfe Admin-Berechtigung...
                </div>
            </div>
        );
    }

    // Error anzeigen (nur bei schweren Fehlern)
    if (error && !users.length && isLoading === false) {
        return (
            <div className="adminContainer">
                <div className="adminErrorMessage">
                    {error}
                </div>
            </div>
        );
    }

    // Users laden
    const loadUsers = async () => {
        try {
            const response = await apiCall('http://localhost:3001/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Users:', error);
        }
    };

    // User anlegen
    const createUser = async () => {
        if (!adminEmail || !adminBenutzername || !adminPasswort || !adminRolle) {
            setError('Alle Felder müssen ausgefüllt werden');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            const response = await apiCall('http://localhost:3001/api/admin/users', {
                method: 'POST',
                body: JSON.stringify({
                    email: adminEmail,
                    username: adminBenutzername,
                    password: adminPasswort,
                    is_admin: adminRolle === 'admin'
                })
            });

            if (response.ok) {
                setSuccessMessage('User erfolgreich angelegt!');
                setAdminEmail('');
                setAdminBenutzername('');
                setAdminPasswort('');
                setAdminRolle('');
                setTimeout(() => setSuccessMessage(''), 3000);
                loadUsers();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Fehler beim Anlegen des Users');
                setTimeout(() => setError(''), 3000);
            }
        } catch (error) {
            setError('Netzwerkfehler beim Anlegen des Users');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Wort anlegen
    const createWord = async () => {
        if (!adminWort || !adminCategory) {
            setError('Wort und Kategorie müssen ausgefüllt werden');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            const categoryMap = { "Stadt": 1, "Land": 2, "Fluss": 3, "Tier": 4 };
            const categoryId = categoryMap[adminCategory];

            const response = await apiCall('http://localhost:3001/api/admin/words', {
                method: 'POST',
                body: JSON.stringify({
                    word: adminWort,
                    category_id: categoryId
                })
            });

            if (response.ok) {
                setSuccessMessage('Wort erfolgreich angelegt!');
                setAdminWort('');
                setTimeout(() => setSuccessMessage(''), 3000);
                // Wörter neu laden
                const categoryMap = { "Stadt": 1, "Land": 2, "Fluss": 3, "Tier": 4 };
                const categoryId = categoryMap[adminCategory];
                loadWords(categoryId);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Fehler beim Anlegen des Wortes');
                setTimeout(() => setError(''), 3000);
            }
        } catch (error) {
            setError('Netzwerkfehler beim Anlegen des Wortes');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Wort löschen
    const deleteWord = async (wordId) => {
        try {
            const response = await apiCall(`http://localhost:3001/api/admin/words/${wordId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setSuccessMessage('Wort erfolgreich gelöscht!');
                setTimeout(() => setSuccessMessage(''), 3000);
                // Wörter neu laden
                const categoryMap = { "Stadt": 1, "Land": 2, "Fluss": 3, "Tier": 4 };
                const categoryId = categoryMap[adminCategory];
                loadWords(categoryId);
            } else {
                setError('Fehler beim Löschen des Wortes');
                setTimeout(() => setError(''), 3000);
            }
        } catch (error) {
            setError('Netzwerkfehler beim Löschen des Wortes');
            setTimeout(() => setError(''), 3000);
        }
    };

    // User löschen (vereinfacht)
    const deleteUserById = async (userId) => {
        try {
            const response = await apiCall(`http://localhost:3001/api/admin/users/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setSuccessMessage('User erfolgreich gelöscht!');
                setTimeout(() => setSuccessMessage(''), 3000);
                loadUsers();
            } else {
                setError('Fehler beim Löschen des Users');
                setTimeout(() => setError(''), 3000);
            }
        } catch (error) {
            setError('Netzwerkfehler beim Löschen des Users');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="adminContainer">
            <header className="adminHeader">
                Admin User Verwaltung
                <button className="adminButtonHome" onClick={() => navigate('/')}>Home</button>
            </header>

            {/* Dezente Error/Success Messages */}
            {successMessage && (
                <div style={{color: '#28a745', fontSize: '14px', marginBottom: '16px', padding: '8px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px'}}>
                    ✓ {successMessage}
                </div>
            )}
            {error && (
                <div style={{color: '#dc3545', fontSize: '14px', marginBottom: '16px', padding: '8px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px'}}>
                    ⚠ {error}
                </div>
            )}

            <div className="adminMain">
                {/* Benutzer Liste */}
                <section className="adminUserListSection">
                   
                    <div className="adminUserListContainer">
                        {users.map((user) => (
                            <p key={user.user_id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee', margin: '0'}}>
                                <span>{user.username} ({user.email}) - {user.is_admin ? 'Admin' : 'User'}</span>
                                <button 
                                    onClick={() => window.confirm('User wirklich löschen?') && deleteUserById(user.user_id)}
                                    style={{border: 'none', maxHeight: '15px', maxwidth: 'auto', color: '#dc3545', fontSize: '25px', cursor: 'pointer'}}
                                    title="User löschen"
                                >
                                    ×
                                </button>
                            </p>
                        ))}
                        {users.length === 0 && <p>Keine Benutzer gefunden</p>}
                    </div>
                </section>

                {/* Benutzer Verwalten */}
                <section className="adminUserManageSection">
                    <h2 className="adminManageTitle">Benutzer Verwalten</h2>

                    <input
                        type="text"
                        placeholder="email"
                        className="adminInput"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                    />

                    <select
                        className="adminInput"
                        value={adminRolle}
                        onChange={(e) => setAdminRolle(e.target.value)}
                    >
                        <option value="">Rolle wählen</option>
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                    </select>

                    <input
                        type="password"
                        placeholder="Passwort"
                        className="adminInput"
                        value={adminPasswort}
                        onChange={(e) => setAdminPasswort(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Benutzer Name"
                        className="adminInput"
                        value={adminBenutzername}
                        onChange={(e) => setAdminBenutzername(e.target.value)}
                    />
                    <div className="adminButtonGroupSpacer">
                        <button className="adminButton" onClick={createUser}>Benutzer Anlegen</button>
                        <button className="adminButton" onClick={loadUsers}>Benutzer neu laden</button>
                    </div>

                    <br />

                    <div className="adminCategoriesRow">
                        <div className="adminCategories" role="radiogroup" aria-label="Kategorie wählen">
                            {["Stadt", "Land", "Fluss", "Tier"].map((cat) => (
                                <div className="adminCategoryItem" key={cat}>
                                    <input
                                        type="radio"
                                        name="adminCategory"
                                        className="adminCategoryCheckbox"
                                        id={`adminCategory-${cat}`}
                                        checked={adminCategory === cat}
                                        onChange={() => setAdminCategory(cat)}
                                        aria-checked={adminCategory === cat}
                                        aria-label={cat}
                                    />
                                    <label className="adminCategoryLabel" htmlFor={`adminCategory-${cat}`}>{cat}</label>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            className="adminTextWort"
                            value={adminWort}
                            onChange={(e) => setAdminWort(e.target.value)}
                            aria-label=" Wort"
                            placeholder=" Wort"
                        />
                        <button
                            className="adminButtonWide"
                            aria-label="Wort anlegen"
                            onClick={createWord}
                        >
                             Wort anlegen
                        </button>
                       
                    </div>

                    {/* Wörter-Liste für gewählte Kategorie */}
                    <div className="adminWordsSection">
                        <h3>Wörter in Kategorie "{adminCategory}"</h3>
                        <div className="adminWordsList">
                            {selectedCategoryWords.length > 0 ? (
                                <div style={{maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '8px'}}>
                                    {selectedCategoryWords.map((word) => (
                                        <div key={word.word_id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', borderBottom: '1px solid #eee'}}>
                                            <span>{word.word}</span>
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm(`Wort "${word.word}" wirklich löschen?`)) {
                                                        deleteWord(word.word_id);
                                                    }
                                                }}
                                                style={{background: 'transparent', border: 'none', maxHeight: '15px', maxWidth: 'auto', color: '#dc3545', fontSize: '25px', cursor: 'pointer'}}
                                                title="Wort löschen"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{color: '#666', fontStyle: 'italic'}}>Keine Wörter in dieser Kategorie gefunden</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}