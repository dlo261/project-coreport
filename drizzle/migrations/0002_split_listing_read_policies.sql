drop policy "listings public read" on public.service_listings;
create policy "listings anon read" on public.service_listings for select to anon using (active);
create policy "listings signed in read" on public.service_listings for select to authenticated using (active or public.is_admin());
