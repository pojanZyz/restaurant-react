function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');

    // Periksa apakah input saat ini bertipe password
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Ubah tipe menjadi text
        toggleIcon.classList.remove('bi-eye-slash-fill');
        toggleIcon.classList.add('bi-eye-fill'); // Ganti ikon menjadi mata terbuka
    } else {
        passwordInput.type = 'password'; // Kembalikan ke password
        toggleIcon.classList.remove('bi-eye-fill');
        toggleIcon.classList.add('bi-eye-slash-fill'); // Kembalikan ikon menjadi mata tertutup
    }
}
