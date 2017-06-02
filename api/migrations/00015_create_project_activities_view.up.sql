CREATE OR REPLACE VIEW project_workloads AS SELECT
    SUM(
        (DATE_PART('day', end_at - start_at) * 24 +
        DATE_PART('hour', end_at - start_at))
    ) as nb_hours,
    start_at::date as date,
    projects.id as project_id,
    projects.user_id as user_id
    FROM frames
    INNER JOIN projects ON (frames.project_id = projects.id)
    GROUP BY (projects.id, projects.user_id, date)
;
