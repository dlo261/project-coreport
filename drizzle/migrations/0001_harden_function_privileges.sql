-- pin search_path on the trigger guard
create or replace function public.ledger_append_only()
returns trigger language plpgsql set search_path = public as $$
begin
  raise exception 'ledger_entries is append-only: % is not permitted', tg_op;
end;
$$;

-- trigger-only functions must not be callable through the API
revoke all on function public.handle_new_user() from anon, authenticated, public;
revoke all on function public.log_admin_write() from anon, authenticated, public;
revoke all on function public.ledger_append_only() from anon, authenticated, public;

-- role checks are used inside policies by signed-in users only
revoke all on function public.has_role(uuid, public.app_role) from anon, public;
revoke all on function public.is_admin() from anon, public;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.is_admin() to authenticated;
