new-session '/usr/local/bin/run_interactive';
new-window -n webpack '/usr/local/bin/run_interactive';
send-keys python Space manage.py Space build Enter;
new-window -n runserver '/usr/local/bin/run_interactive';
send-keys python Space manage.py Space runserver Space 0.0.0.0:8000 Enter;
