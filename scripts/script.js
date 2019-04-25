function deleteUser(elem) {
    if (confirm("Delete user?")) {
        elem.parentElement.setAttribute('action', '/deleteUser');
        elem.parentElement.submit();
    }
}

function editUser(elem) {
    console.log(elem);
    elem.parentElement.setAttribute('action', '/editUser');
    elem.parentElement.submit();
}

