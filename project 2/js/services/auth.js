class AuthService {
    constructor() {
        // Abstracting over Firestore for Voluteer Auth.
        // TODO: Prepare migration to native firebase.auth().
    }

    async register(name, email, phone, password) {
        // Logic currently relies on custom \`tempRegData\` setup, 
        // to migrate we would use firebase.auth().createUserWithEmailAndPassword inside this method
        // and map the Auth user UID back to the volunteers document.
        try {
            const tempRegData = {
                name: name, email: email, phone: phone,
                password: password, // TO DO: Remove cleartext password when migrating to Firebase Auth
                helpCount: 0, totalMinutes: 0, ratings: []
            };
            const tempCode = Math.floor(1000 + Math.random() * 9000).toString();
            return { tempRegData, tempCode };
        } catch (err) {
            throw err;
        }
    }

    async verifyCode(inputCode, generatedCode, regData) {
        if (inputCode === generatedCode) {
            // Save to Firestore. On Firebase Auth migration, this is where db insert links with mapped User.uid
            await window.db.collection('volunteers').doc(regData.email).set(regData);
            return regData;
        } else {
            throw new Error("Неверный код");
        }
    }

    async login(email, password, volunteersCache) {
        // Fake local cache check. When transitioning to native firebase.auth(), we will just call firebase.auth().signInWithEmailAndPassword
        const u = volunteersCache.find(v => v.email === email && v.password === password);
        if (u) return u;
        throw new Error("Ошибка входа (неверный email или пароль)");
    }
}
window.authService = new AuthService();
