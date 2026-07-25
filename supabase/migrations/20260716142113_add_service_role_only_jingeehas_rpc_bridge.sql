create or replace function public.jingeehas_execute_request(request jsonb)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select jingeehas.execute_request(request);
$$;

revoke all on function public.jingeehas_execute_request(jsonb) from public, anon, authenticated;
grant execute on function public.jingeehas_execute_request(jsonb) to service_role;;
