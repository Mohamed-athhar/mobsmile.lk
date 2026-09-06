-- Split public/staff visibility so anon never needs the role helpers
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Staff can view all categories" ON public.categories FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Public can view active brands" ON public.brands;
CREATE POLICY "Anyone can view active brands" ON public.brands FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Staff can view all brands" ON public.brands FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Staff can view all products" ON public.products FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Public can view active banners" ON public.banners;
CREATE POLICY "Anyone can view active banners" ON public.banners FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Staff can view all banners" ON public.banners FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Public can view active plans" ON public.installment_plans;
CREATE POLICY "Anyone can view active plans" ON public.installment_plans FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Staff can view all plans" ON public.installment_plans FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff manage banners" ON public.banners;
CREATE POLICY "Staff insert banners" ON public.banners FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update banners" ON public.banners FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Admins delete banners" ON public.banners FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Staff manage plans" ON public.installment_plans;
CREATE POLICY "Staff insert plans" ON public.installment_plans FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update plans" ON public.installment_plans FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Admins delete plans" ON public.installment_plans FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Lock down helper execution to signed-in users only (RLS needs it there)
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;