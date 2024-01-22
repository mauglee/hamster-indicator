const {Clutter, GObject, St, GLib} = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const Mainloop = imports.mainloop;
const Gio = imports.gi.Gio;

let indicatorExtension, iconBox, timeout;

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, 'Hamster indicator');

            this._container = new St.BoxLayout();
            iconBox = new St.Bin({
                style_class: 'hamster-box',
                y_align: Clutter.ActorAlign.CENTER,
            });
            this._icon = new St.Icon({
                icon_name: 'clock-symbolic',
                style_class: 'system-status-icon'
            });

            iconBox.set_child(this._icon);
            this._container.add_actor(iconBox);

            let bin = new St.Bin();
            this.add_actor(bin);
            bin.set_child(this._container);

            this.connect('event', this._onClicked.bind(this));
        }

        _onClicked(actor, event) {
            if (
                event.type() === Clutter.EventType.TOUCH_BEGIN ||
                event.type() === Clutter.EventType.BUTTON_PRESS
            ) {
                GLib.spawn_command_line_async('hamster');
            }

            return Clutter.EVENT_PROPAGATE;
        }
    }
);

function update_status() {
    try {
        let subprocess = Gio.Subprocess.new(
            ['hamster', 'current'],
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        );
        subprocess.communicate_utf8_async(null, null, (proc, res) => {
            let [, stdout, stderr] = proc.communicate_utf8_finish(res);
            let current = stdout.trim();
            if ('No activity' === current) {
                iconBox.remove_style_class_name('active');
            } else {
                iconBox.add_style_class_name('active');
            }
        });
    } catch (e) {
        logError(e);
    }

    return true;
}

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);

        timeout = Mainloop.timeout_add_seconds(5.0, update_status);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;

        Mainloop.source_remove(timeout);
    }
}

function init(meta) {
    indicatorExtension = new Extension(meta.uuid);

    return indicatorExtension;
}
