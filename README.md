# Hamster indicator
Gnome shell extension for (simple) Hamster indicator

## Memo
`gnome-extensions pack --force hamster-indicator@mauglee.gmail.com`

`gnome-extensions install -f ./hamster-indicator@mauglee.gmail.com.shell-extension.zip`

`gnome-extensions enable hamster-indicator@mauglee.gmail.com`

`gnome-extensions disable hamster-indicator@mauglee.gmail.com`

## Developing process

### Build

`gnome-extensions pack --force hamster-indicator@mauglee.gmail.com`

### Install
`gnome-extensions install -f ./hamster-indicator@mauglee.gmail.com.shell-extension.zip`

### Reload
<kbd>Alt</kbd> + <kbd>F2</kbd> → <kbd>R</kbd> → <kbd>enter</kbd>

### Watch logs
`journalctl -f -o cat /usr/bin/gnome-shell`
