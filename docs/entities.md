## player

- id
- email
- riot_id
- created_at

## team

- id
- name
- created_by
- created_at

## team_player

- id
- player_id
- team_id
- joined_at

## tournament

- id
- name
- description
- start_date
- end_date
- winner_team_id
- created_at
- min_teams
- max_teams

## tournament_team

- id
- tournament_id
- team_id
- joined_at

## match

- id
- tournament_id
- blue_team_id
- red_team_id
- blue_team_score
- red_team_score
- riot_match_id
- winner_team_id
- created_at
